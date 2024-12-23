// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Header } from './Header';
import { BreadCrumbs } from './BreadCrumbs';
import { ProductCardContainer } from './UsersComponents/ProductCardContainer';

export const Home = () => {

  const breadcrumbs = [
    { label: "Home", href: "/"},
    { label: "products", href: "/home"}
  ]
  return (
    <div>
      <Header>
        <BreadCrumbs crumbs={breadcrumbs}></BreadCrumbs>
        <ProductCardContainer></ProductCardContainer>
      </Header>
    </div>
  );
};

