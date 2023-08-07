import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductManagementApp.css"; // Import CSS file for styling

const ProductManagementApp = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "" });
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products/");
      setProducts(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredResults = products.filter((product) =>
      product.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleAddProduct = async () => {
    try {
      const response = await axios.post("https://fakestoreapi.com/products/", newProduct);
      setProducts([...products, response.data]);
      setSearchResults([...searchResults, response.data]);
      setNewProduct({ title: "", description: "", price: "" });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `https://fakestoreapi.com/products/${selectedProductId}`,
        newProduct
      );
      const updatedProductIndex = products.findIndex(
        (product) => product.id === selectedProductId
      );
      const updatedProducts = [...products];
      updatedProducts[updatedProductIndex] = response.data;
      setProducts(updatedProducts);
      setSearchResults(updatedProducts);
      setNewProduct({ title: "", description: "", price: "" });
      setSelectedProductId(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`https://fakestoreapi.com/products/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
      setSearchResults(searchResults.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleChange = (event) => {
    setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
  };

  const handleEditProduct = (productId) => {
    const selectedProduct = products.find((product) => product.id === productId);
    setNewProduct(selectedProduct);
    setSelectedProductId(productId);
  };

  return (
    <div>
      <h1><center>Product Management App</center></h1>

      <h2>Add Product</h2>
      <div>
        <label>Title:</label>
        <input type="text" name="title" value={newProduct.title} onChange={handleChange} />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={newProduct.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Price:</label>
        <input type="text"          name="price"
          value={newProduct.price}
          onChange={handleChange}
        />
      </div>
      {selectedProductId ? (
        <button onClick={handleUpdateProduct}>Put</button>
      ) : (
        <button onClick={handleAddProduct}>Post</button>
      )}

      <h2>Product List</h2>
      <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>
                <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                <button onClick={() => handleEditProduct(product.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagementApp;
