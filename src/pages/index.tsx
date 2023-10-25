import { Character } from "@prisma/client";
import { useState } from "react";
import { CategoryPills } from "~/components/category_pills/category_pills";
import { PlayGridItem } from "~/components/play_grid/play_grid_item";
import { api } from "~/utils/api";

export default function Home() {
  const categories = Object.keys(Character);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] ?? "");

  const { data: plays } = api.play.getAllApproved.useQuery(
    {
      currentPage: 1,
      pageSize: 10,
      filter: {},
    },
    { refetchOnWindowFocus: false },
  );

  return (
    <div className="overflow-x-hidden px-8 pb-4">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {plays?.map((play) => <PlayGridItem key={play.id} {...play} />)}
      </div>
    </div>
  );
}
