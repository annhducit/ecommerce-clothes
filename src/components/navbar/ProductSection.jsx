import React from "react";
import Item from "../Item/Item";
import productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { Spin } from "antd";

const ProductSection = () => {
    const [searchParams, _] = useSearchParams();

    const p = searchParams.get("p") || "";

    const { data: products, isLoading } = useQuery({
        queryKey: ["/products/available", p],
        queryFn: () => productService.getProductsBySearch("", Number(p)),
        select: (data) => {
            return data?.data ? JSON.parse(data.data) : null;
        },
        enabled: !!p,
    });

    return (
        <div className="popular">
            <div className="popular-item">
                {isLoading ? (
                    <Spin />
                ) : (
                    products?.map((item, i) => (
                        <Item
                            key={i}
                            id={item.productId}
                            categoryName={item.categoryName}
                            stockQuantity={item.stockQuantity}
                            name={item.productsName}
                            variant={item.variants?.[4]?.size || "N/A"}
                            image={`${item.images[0].productImage}`}
                            new_price={item.price}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductSection;
