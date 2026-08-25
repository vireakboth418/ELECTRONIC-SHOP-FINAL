import { defineStore } from "pinia";
import type { Product } from "../type/product";
import { ref } from "vue";
 
export const useProductStore = defineStore('prouctApi',()=>{

    const productList = ref<Product[] | null>(null)
    const isGetProductsLoading = ref<boolean>(false)

    const isloading = ref<boolean>(false)


    async function getAllProducts(){
        isGetProductsLoading.value = true
        try{
            const res = await fetch("/api/products")
            const data = await res.json()
            productList.value = data
        }catch(err){
            console.error("Error fetching products:", err)
        }finally{
            isGetProductsLoading.value = false
        }
    }

    async function getProductById(id: number | string): Promise<Product | null>{
        isloading.value = true
        try{
            
            const res = await fetch(`/api/products/${id}`)
            if (!res.ok) {
                return null
            }
            const data = await res.json()
            return data
        }catch(err){
            console.log(err)
            return null
        }finally{
            isloading.value = false
        }
    }

    return {
        productList,
        getAllProducts,
        isGetProductsLoading,
        getProductById,
        isloading
    }

})
