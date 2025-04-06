export interface IngestionResponse {
    message: string;
    ingestion: {
      id: string;
      userId: string;
      documentId: string;
      status: string;
      ingestedAt: string;
    };
  }