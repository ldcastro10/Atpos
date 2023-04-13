import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderView.css';
import { getApps } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from "../firebase/config"

const productsData = [
  {
    id: 1,
    name: 'Manzanas',
    quantity: 100,
    unitPrice: 1000,
    icon: '🍎',
  },
  {
    id: 2,
    name: 'Tomates',
    quantity: 50,
    unitPrice: 500,
    icon: '🍅',
  },
  {
    id: 3,
    name: 'Bananas',
    quantity: 150,
    unitPrice: 600,
    icon: '🍌',
  },
];

const firebaseApp = !getApps().length ? app : getApps()[0];
const db = getFirestore(firebaseApp);
const pedidosCollection = collection(db, 'pedidos');

const OrderView = () => {
  const [products, setProducts] = useState(productsData);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [requestCount, setRequestCount] = useState(1);
  const today = new Date().toLocaleDateString();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleQuantityChange = (productId, delta) => {
    setProducts((prevState) =>
      prevState.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + delta }
          : product
      )
    );
  };

  const handleSave = () => {
    let successfulRequests = 0;
  
    const saveRequest = async () => {
      const isCurrentlyOnline = window.navigator.onLine;
    
      if (!isCurrentlyOnline) {
        const storedData = localStorage.getItem('productsData');
        let updatedData;
    
        if (storedData) {
          updatedData = JSON.parse(storedData);
          updatedData.push(products);
        } else {
          updatedData = [products];
        }
    
        localStorage.setItem('productsData', JSON.stringify(updatedData));
        console.log('Pedido guardado! en local');
        return true;
      } else {
        try {
          await addDoc(pedidosCollection, { products });
          console.log('Pedido guardado! en nube');
          return true;
        } catch (error) {
          console.error('Error al guardar el pedido:', error);
          return false;
        }
      }
    };    
  
    const processRequests = async (currentRequest) => {
      const isSuccess = await saveRequest();
      if (isSuccess) {
        successfulRequests++;
      }
  
      if (currentRequest === requestCount) {
        if (successfulRequests === requestCount) {
          console.log(`Todas las ${requestCount} peticiones de guardar fueron exitosas.`);
        } else {
          console.log(`Sólo ${successfulRequests} peticiones de guardar fueron exitosas.`);
        }
      }
    };
  
    for (let i = 1; i <= requestCount; i++) {
      setTimeout(() => {
        processRequests(i);
      }, i * 500);
    }
  };
    


  const removeProduct = (productId) => {
    setProducts((prevState) => prevState.filter((product) => product.id !== productId));
  };

  const total = products.reduce(
    (acc, product) => acc + product.quantity * product.unitPrice,
    0
  );

  return (
    <div className="order-container">
      <div className="order-view">
        <h1>Pedido en edición</h1>
        <div className="order-info">
          <p>Número de pedido: 12345</p>
          <p>Número de factura: 67890</p>
          <p>Local: Supermercado La Colina</p>
          <p>Fecha: {today}</p>
          <p>Cajero: Juan Pérez</p>
        </div>
        <table className="order-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio unitario</th>
              <th>Precio total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.icon} {product.name}
                </td>
                <td>{product.quantity}</td>
                <td>{product.unitPrice}</td>
                <td>{product.quantity * product.unitPrice}</td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => handleQuantityChange(product.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="action-button"
                    onClick={() => handleQuantityChange(product.id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="action-button remove-button"
                    onClick={() => removeProduct(product.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-total">
          <strong>Total: {total}</strong>
          <input
            type="number"
            min="1"
            value={requestCount}
            onChange={(e) => setRequestCount(parseInt(e.target.value))}
          />
          <button className="save-button" onClick={handleSave}>Guardar</button>
        </div>

      </div>
    </div>
  );
};

export default OrderView;
