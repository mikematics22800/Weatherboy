import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from './routes/Root.jsx';
import Home from './routes/Home.jsx';
import WeatherMap from './routes/WeatherMap.jsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root/>,
      children: [
        {
          path: "/",
          element: <Home/>,
          errorElement: <Error/>
        },
        {
          path: "/map",
          element: <WeatherMap/>,
          errorElement: <Error/>
        },
      ]
    }
  ], 
  { 
    basename: "/Weatherboy/" 
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />  
  </React.StrictMode>,
)
