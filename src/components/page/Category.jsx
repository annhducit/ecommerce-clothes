import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductSection from "../navbar/ProductSection";
import { Flex, Spin } from "antd";
import SalesBanner from "./SalesBanner ";

const Category = () => {
    const [searchParams, _] = useSearchParams();

    const p = searchParams.get("p") || "";

    const { data: products, isLoading: isLoadingProducts } = useQuery({
        queryKey: ["/products/available", p],
        queryFn: () => productService.getProductsBySearch("", p),
        select: (data) => {
            return data?.data ? JSON.parse(data.data) : null;
        },
    });

    const showBanner = React.useMemo(
        () =>
            products?.some(
                (item) =>
                    item.categoryName.includes("Men") ||
                    item.categoryName.includes("Women") ||
                    item.categoryName.includes("Kid")
            ) || false,
        [products]
    );

    return (
        <Flex vertical>
            {showBanner && <SalesBanner />}
            {isLoadingProducts ? (
                <Spin />
            ) : (
                <ProductSection products={products} />
            )}
        </Flex>
    );
};

export default Category;
