import { test, expect } from '@playwright/test';

// Shopping cart data
const USER = 'fake@fake.com';
const PRODUCT = 'Xbox Wireless Controller Lunar Shift Special Edition';
const PRODUCTID = 1;
const PRODUCTIMAGE = 'PID1-1.jpg';
const PRODUCTPRICE = 99;
const PRODUCTQUANTITY = 1;

// SETUP: Create a new cart
test.beforeAll(async ({ request }) => {
    const newCart = await request.post(`${process.env.REACT_APP_APIURLSHOPPINGCART}/ShoppingCart`, {
        data: {
            cartItemId: "string",
            email: USER,
            productId: PRODUCTID,
            name: PRODUCT,
            price: PRODUCTPRICE,
            imageUrl: PRODUCTIMAGE,
            quantity: PRODUCTQUANTITY
        }
    });
    await expect(newCart.status()).toBe(201);
});

test.describe('Shopping Cart API', () => {
    test('should be able to GET shopping cart', async ({ request }) => {
        const cart = await request.get(`${process.env.REACT_APP_APIURLSHOPPINGCART}/ShoppingCart`, {
            headers: {
                'Accept': 'accept: */*',
                'x-tt-email': USER,
            }
        });
        await expect(cart.status()).toBe(200);

        await expect(await cart.json()).toContainEqual(expect.objectContaining({
            email: USER,
            productId: PRODUCTID,
            name: PRODUCT,
            price: PRODUCTPRICE,
            imageUrl: PRODUCTIMAGE,
            quantity: PRODUCTQUANTITY
        }));
    });
});

// TEARDOWN: Delete the cart
test.afterAll(async ({ request }) => {
    const cart = await request.get(`${process.env.REACT_APP_APIURLSHOPPINGCART}/ShoppingCart`, {
        headers: {
            'Accept': 'accept: */*',
            'x-tt-email': USER,
        }
    });
    await expect(cart.status()).toBe(200);

    // Loop through each cart item and delete it
    const cartBody = JSON.parse(await cart.text());
    for (let i = 0; i < cartBody.length; i++) {
        const deleteCart = await request.delete(`${process.env.REACT_APP_APIURLSHOPPINGCART}/ShoppingCart/product`, {
            data: {
                cartItemId: cartBody[i].cartItemId,
                email: USER,
                productId: cartBody[i].productId,
                name: cartBody[i].name,
                price: cartBody[i].price,
                imageUrl: cartBody[i].imageUrl,
                quantity: cartBody[i].quantity
            }
        });
        await expect(deleteCart.status()).toBe(200);
    }
});