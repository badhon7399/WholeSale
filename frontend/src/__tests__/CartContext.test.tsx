import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

const TestComponent = () => {
  const { cart, addToCart, updateQuantity, removeFromCart, getCartTotal, getTierPrice } = useCart();
  return (
    <div>
      <div data-testid="cart-length">{cart.length}</div>
      <div data-testid="cart-total">{getCartTotal()}</div>
      {cart.map((item) => (
        <div key={item.product._id} data-testid={`item-${item.product._id}`}>
          <span data-testid={`title-${item.product._id}`}>{item.product.title}</span>
          <span data-testid={`qty-${item.product._id}`}>{item.quantity}</span>
          <span data-testid={`price-${item.product._id}`}>{getTierPrice(item)}</span>
          <button
            data-testid={`update-btn-${item.product._id}`}
            onClick={() => updateQuantity(item.product._id, 60)}
          >
            Update to 60
          </button>
          <button
            data-testid={`update-low-btn-${item.product._id}`}
            onClick={() => updateQuantity(item.product._id, 2)}
          >
            Update to 2
          </button>
          <button
            data-testid={`remove-btn-${item.product._id}`}
            onClick={() => removeFromCart(item.product._id)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        data-testid="add-btn-1"
        onClick={() =>
          addToCart(
            {
              _id: 'prod1',
              title: 'Cotton T-Shirt',
              moq: 10,
              priceTiers: [
                { minQuantity: 10, pricePerUnit: 100 },
                { minQuantity: 50, pricePerUnit: 80 },
              ],
              supplier: { _id: 'sup1', name: 'Supplier One', companyName: 'Sup Co' },
            },
            5 // less than MOQ
          )
        }
      >
        Add Less Than MOQ
      </button>
      <button
        data-testid="add-btn-2"
        onClick={() =>
          addToCart(
            {
              _id: 'prod2',
              title: 'Industrial Motor',
              moq: 2,
              priceTiers: [
                { minQuantity: 2, pricePerUnit: 1000 },
                { minQuantity: 10, pricePerUnit: 900 },
              ],
              supplier: { _id: 'sup2', name: 'Supplier Two', companyName: 'Sup Inc' },
            },
            15 // matches higher tier
          )
        }
      >
        Add High Tier Qty
      </button>
    </div>
  );
};

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with an empty cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-length').textContent).toBe('0');
    expect(screen.getByTestId('cart-total').textContent).toBe('0');
  });

  it('should add item and enforce MOQ bounds', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add item 1 with quantity 5 (MOQ is 10)
    fireEvent.click(screen.getByTestId('add-btn-1'));

    expect(screen.getByTestId('cart-length').textContent).toBe('1');
    // MOQ of 10 should be enforced
    expect(screen.getByTestId('qty-prod1').textContent).toBe('10');
    expect(screen.getByTestId('price-prod1').textContent).toBe('100');
    expect(screen.getByTestId('cart-total').textContent).toBe('1000'); // 10 * 100
  });

  it('should calculate higher price tier correctly', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add item 2 with quantity 15 (MOQ is 2, higher tier at 10 is 900)
    fireEvent.click(screen.getByTestId('add-btn-2'));

    expect(screen.getByTestId('cart-length').textContent).toBe('1');
    expect(screen.getByTestId('qty-prod2').textContent).toBe('15');
    // Tiered pricing at 15 qty should resolve to 900 per unit
    expect(screen.getByTestId('price-prod2').textContent).toBe('900');
    expect(screen.getByTestId('cart-total').textContent).toBe('13500'); // 15 * 900
  });

  it('should update item quantity and enforce MOQ on updates', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Add item 1 (quantity: MOQ = 10)
    fireEvent.click(screen.getByTestId('add-btn-1'));

    // Update quantity to 60 (price resolves to tier 2: 80)
    fireEvent.click(screen.getByTestId('update-btn-prod1'));
    expect(screen.getByTestId('qty-prod1').textContent).toBe('60');
    expect(screen.getByTestId('price-prod1').textContent).toBe('80');
    expect(screen.getByTestId('cart-total').textContent).toBe('4800'); // 60 * 80

    // Update quantity to 2 (below MOQ of 10)
    fireEvent.click(screen.getByTestId('update-low-btn-prod1'));
    expect(screen.getByTestId('qty-prod1').textContent).toBe('10'); // should fall back to MOQ
    expect(screen.getByTestId('price-prod1').textContent).toBe('100');
    expect(screen.getByTestId('cart-total').textContent).toBe('1000');
  });

  it('should remove items and clear the cart', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByTestId('add-btn-1'));
    expect(screen.getByTestId('cart-length').textContent).toBe('1');

    fireEvent.click(screen.getByTestId('remove-btn-prod1'));
    expect(screen.getByTestId('cart-length').textContent).toBe('0');
  });
});
