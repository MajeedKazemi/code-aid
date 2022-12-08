export interface IDocPageProps {
    pageId: string;
    onSectionChange: (prevSection: string, nextSection: string) => void;
}
