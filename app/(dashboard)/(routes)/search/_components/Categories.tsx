"use client";
import { Catagory } from "@prisma/client";

import { CategoryItem } from "./category-item";
interface CategoriesProps{
    items: Catagory[];
}

// const iconMap: Record<Catagory["name"],IconType>={

// }

export const Categories = ({items,}
    :CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item)=>(
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    value={item.id}
                />
            ))}            
        </div>
    );
}


