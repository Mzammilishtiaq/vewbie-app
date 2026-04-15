///get-schedule-events?limit=10&offset=0
export interface Category {
  id: number;
  name: string;
  slug: string;
}
export interface EventItemProps {
  online: boolean;
  name: string;
  thumbnail: string;
  slug: string;
  isFree: boolean;
  startDatetime: string;
  endDatetime: string;
  mediaId: string;
  stream: string;
  subscribers: number;
  categories: Category[];
}

export interface ListAllCategoryProps {
  id: number;
  name: string;
  slug: string;
  layout: string;
  thumbnail: string | null;
  parentId: number | null;
  subChannelId: number | null;
  hostName: string | null;
  promoted: number; // 0 or 1
  subCategoriesCount: string; // comes as string from API
}

export interface RecentVideoItemProps {
  name: string;
  slug: string;
  timestamp: string; // ISO date string
  description: string;
  tags: any[]; // you can replace with string[] if tags are strings
  duration: string; // format "HH:mm:ss"
  isFree: boolean;
  isFromChildChannel: boolean;
  subchannelUrl: string;
  isPaid: boolean;
  redirectMediaUrl: string;
  channelHostName: string;
  thumbnail: string;
  categories: [
    {
      id: number;
      name: string;
      slug: string;
      thumbnail: string | null;
    }
  ];
}
export interface ListAllPromotedCategoriesProps {
  id: number;
}

export interface PromotedCategoriesProps {
    media: {
      name: string;
      slug: string;
      timestamp: string;
      description: string | null;
      startDatetime: string | null;
      type: 'VIDEO';
      duration: string;
      thumbnail: string;
      isFree: boolean;
      isPaid: boolean;
      viewers: number;
      channelHostName: string;
      categories: {
        id: number;
        name: string;
        slug: string;
        totalVideos: string;
      }[];
      categorySlug: string;
      categoryName: string;
      layout: 'HORIZONTAL_4_BOXED';
      subchannelId: number | null;
    }[];
  }[];
