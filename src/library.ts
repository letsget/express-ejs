import { Book } from "./types";
export const library: Book[] = [
    {
        id: "1",
        title: "To Kill a Mockingbird",
        description:
            "A novel about the serious issues of rape and racial inequality.",
        authors: "Harper Lee",
        favorite: true,
        fileCover: "mockingbird_cover.jpg",
        fileName: "to_kill_a_mockingbird.pdf"
    },
    {
        id: "2",
        title: "1984",
        description:
            "A dystopian novel that delves into the dangers of totalitarianism.",
        authors: "George Orwell",
        favorite: true,
        fileCover: "1984_cover.jpg",
        fileName: "1984.pdf"
    },
    {
        id: "3",
        title: "The Great Gatsby",
        description: "A critique of the American Dream set in the Jazz Age.",
        authors: "F. Scott Fitzgerald",
        favorite: true,
        fileCover: "great_gatsby_cover.jpg",
        fileName: "the_great_gatsby.pdf"
    },
    {
        id: "4",
        title: "Pride and Prejudice",
        description:
            "A romantic novel that also critiques the British landed gentry.",
        authors: "Jane Austen",
        favorite: true,
        fileCover: "pride_and_prejudice_cover.jpg",
        fileName: "pride_and_prejudice.pdf"
    },
    {
        id: "5",
        title: "The Catcher in the Rye",
        description:
            "A novel that explores themes of teenage angst and alienation.",
        authors: "J.D. Salinger",
        favorite: true,
        fileCover: "catcher_in_the_rye_cover.jpg",
        fileName: "the_catcher_in_the_rye.pdf"
    },
];