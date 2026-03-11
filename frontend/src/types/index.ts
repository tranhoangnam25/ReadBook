export interface Book {
    id: number
    title: string
    description: string
    author: Author
    price: number
    previewPercentage: number
    coverImage: string
    categories: Category[]
    publishYear: number
    createdAt: Date
    updatedAt: Date
}

export interface Author {
    id: number
    name: string
    biography: string
    avatar_url: string
    created_at: Date
}

export interface Category {

}
