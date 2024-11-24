Claro, aquí tienes una versión ampliada de tu archivo README.md que incluye ejemplos detallados de componentes, tool calling, intents, código, reglas y prompts. Además, he añadido las instrucciones para los estilos Neumorphism y Glassmorphism.

# Multimodal Farmers Market Chatbot

A sophisticated chatbot application for a farmers market, powered by AI. This app combines natural language processing with real-time product interaction to deliver an intuitive shopping experience.

---

## Features 🚀

- 🤖 **AI-powered conversational interface**: Natural language chat for browsing and ordering.
- 🛒 **Shopping cart functionality**: Real-time updates and management.
- 📦 **Dynamic product catalog**: Automatically updated with seasonal and available items.
- 🎨 **Neumorphism & Glassmorphism UI**: A modern and immersive design style.
- 🔄 **Real-time component streaming**: Smooth and dynamic UI rendering.
- 📝 **Order summary and tracking**: Keep track of your purchases.
- 🌟 **Multi-tool calling support**: Intelligently handle complex user requests with multiple API integrations.

---

## Tech Stack 🛠️

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Neumorphism and Glassmorphism utilities
- **AI Integration**: OpenAI API
- **Deployment**: Vercel AI SDK
- **Database**: Firebase for authentication and data management

---

## Getting Started 🏗️

### Prerequisites

Ensure you have:
- Node.js (>= 16.8)
- npm or yarn
- OpenAI API Key
- Firebase configuration details

### Installation Steps

1. **Clone the repository**:
    ```bash
    git clone https://github.com/BrainmuscleAI/multimodal-farmers-market-chatbot.git
    cd multimodal-farmers-market-chatbot
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    - Copy the example environment file:
      ```bash
      cp .env.example .env.local
      ```
    - Edit `.env.local` and add the required API keys:
      ```
      OPENAI_API_KEY=your_openai_api_key
      NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
      ```

4. **Run the development server**:
    ```bash
    npm run dev
    ```

5. **Inspect application structure**:
    Before coding, inspect the file structure and dependencies:
    ```bash
    tree -I 'node_modules'
    ```

6. **Open the application**:
    Navigate to [http://localhost:3000](http://localhost:3000) to start using the chatbot.

---

## Component Examples 📦

### **Product Card**
A reusable component for displaying product details.

```tsx
import React from 'react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="glass-card p-4 rounded-lg shadow-lg">
    <img src={product.image} alt={product.name} className="rounded-lg w-full" />
    <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
    <p className="text-gray-700">{product.description}</p>
    <button className="btn-neumorphic mt-4">Add to Cart</button>
  </div>
);

export default ProductCard;

Shopping Cart

Displays a list of items in the cart with real-time updates.

import React from 'react';

const ShoppingCart: React.FC<{ cartItems: CartItem[] }> = ({ cartItems }) => (
  <div className="glass-container p-6 rounded-lg">
    <h1 className="text-2xl font-bold">Your Cart</h1>
    {cartItems.map((item) => (
      <div key={item.id} className="flex justify-between items-center mt-2">
        <span>{item.name}</span>
        <span>{item.quantity}</span>
        <span>${item.price}</span>
      </div>
    ))}
  </div>
);

export default ShoppingCart;

Tool Calling and Intents 🔧

Supported Intents

	1.	Product Search: Search for available products.
	2.	Add to Cart: Add specified items to the cart.
	3.	Checkout: Finalize the user’s purchase.
	4.	Order Status: Retrieve information about current orders.
	5.	Recommendations: Suggest products based on user preferences.

Example Tool Calling Flow

async function handleIntent(intent, params) {
  switch (intent) {
    case 'ProductSearch':
      return await searchProducts(params.query);
    case 'AddToCart':
      return await addToCart(params.productId, params.quantity);
    case 'Checkout':
      return await initiateCheckout(params.cartId);
    case 'OrderStatus':
      return await getOrderStatus(params.orderId);
    case 'Recommendations':
      return await fetchRecommendations(params.userId);
    default:
      throw new Error('Unknown intent');
  }
}

Multiple Tool Calling Example

Handles complex interactions with multiple API calls.

async function handleComplexIntent(userInput) {
  const { intent, entities } = await parseIntent(userInput);

  if (intent === 'OrderAndRecommendations') {
    const [orderDetails, recommendations] = await Promise.all([
      handleIntent('Checkout', { cartId: entities.cartId }),
      handleIntent('Recommendations', { userId: entities.userId }),
    ]);
    return { orderDetails, recommendations };
  }
}

Design Styles 🎨

Neumorphism Utility

Add the following classes to your Tailwind CSS configuration:

module.exports = {
  theme: {
    extend: {
      boxShadow: {
        neumorphic: '8px 8px 15px #b8b9be, -8px -8px 15px #ffffff',
      },
    },
  },
};

Use in components:

<div className="rounded-lg shadow-neumorphic p-4">...</div>

Glassmorphism Utility

Add this CSS for the glass effect:

.glass-card {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

Rules and Prompts ⚙️

Rules

	1.	Always validate user input before tool calling.
	2.	Prioritize accuracy over speed for sensitive operations (e.g., payment).
	3.	Return actionable error messages for unhandled intents.

Prompts

General Prompt Template

You are a farmers market assistant. Help users browse and order fresh products. When they provide input, extract their intent and respond with the appropriate action or clarification.

Tool Calling Prompt

The user said: "{user_input}". Parse the intent and call the appropriate tools with the parameters extracted.

Error Handling Prompt

If an error occurs, apologize and guide the user to reattempt their request.

Inspect Application 📁

Before modifying, always inspect the current file structure:

tree -I 'node_modules'

Contact 📧

For support, please reach out to BrainmuscleAI.
