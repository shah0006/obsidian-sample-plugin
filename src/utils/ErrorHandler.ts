import { Notice } from "obsidian";

export enum ErrorType {
    TAG_PROCESSING,
    FILE_OPERATION,
    VIEW_RENDERING,
    SETTINGS
}

export class TagHierarchyError extends Error {
    type: ErrorType;

    constructor(message: string, type: ErrorType) {
        super(message);
        this.type = type;
        this.name = 'TagHierarchyError';
    }
}

export function handleError(error: any, fallbackMessage: string): void {
    console.error(`[Tag Hierarchy] ${error.message || fallbackMessage}`, error);
    new Notice(`Tag Hierarchy: ${error.message || fallbackMessage}`);
}
