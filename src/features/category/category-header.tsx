import { SectionHeader } from "@/components/ui/section-header"

interface CategoryHeaderProps {
  category: {
    name: string
    description: string
  }
}

export function CategoryHeader({ category }: CategoryHeaderProps) {
  return <SectionHeader title={category.name} description={category.description} />
}

