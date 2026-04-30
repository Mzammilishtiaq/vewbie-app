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
    },
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
}
[];

export interface listCategoriesPatternsProps {
  id: number;
  categoryName: string;
  layout: string;
  parentId: number | null;
  promoted: number; // 0 or 1
  slug: string;
  createdAt: string; // ISO date string
  subchannelId: number;
  hostName: string;
  domainName: string | null;
  subSategories: string; // looks like string "0"
  thumbnail: string | null;
  optimized: any | null;
  online: boolean;
}

export interface SubCategoriesSlugProps {
  id: number;
  categoryName: string;
  categorySlug: string;
  categoryThumbnail: string | null;
  subchannelId: number | null;
  videos: string; // ⚠️ comes as string from API
  subchannelUrl: string | null;
  subchannelLogo: string | null;
}

export interface VideoSlugItemProps {
  title: string;
  slug: string;
  type: 'VIDEO' | string;
  thumbnail: string;
  duration: string;
  redirectMediaUrl: string;
  isFree: boolean;
  mediaId: string;
  stream: string | null;
  timestamp: string; // ISO date string
}

export interface VideoDetailItemProps {
  id: number;
  media_id: string;
  title: string;
  price: string;
  duration: string;
  loginRequired: boolean;
  isFree: boolean;
  isPaid: boolean;
  isVideo: boolean;
  description: string;
  timestamp: string; // ISO date string
  isAds: boolean;
  type: string;
  isFav: number;
  subscriptions: {
    id: string;
    name: string;
    price: string;
    type: string;
  }[];
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  playerSettings: {
    poster_url: string;
    isMediaAds: string; // e.g. "PRE_ROLL"
    adsIntervalTime: number;
  };
}

export interface RelatedVideoItemProps {
  id: number;
  mediaId: string;
  slug: string;
  type: string; // or "VIDEO" | "LIVE" | "AUDIO" if you want strict typing
  name: string;
  description: string;
  timestamp: string;
  duration: string;
  thumbnail: string;
}

export interface SubscriptionProps {
  slug: string;
  price: number;
  billingFrequency: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  subscriberStartDate: Date;
  subscriberEndDate: Date;
  hostName: string;
  isRecurring: boolean;
}

export interface VideoDetailLiveItemProps {
  id: number;
  media_id: string;
  title: string;

  isFree: boolean;
  isPaid: boolean;
  loginRequired: boolean;
  subscribers: number;
  online: boolean;

  description: string;
  startDatetime: string;
  timestamp: string;

  isAds: boolean;
  type: string;

  subscriptions: {
    id: string;
    name: string;
    price: string;
  }[];
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  playerSettings: {
    hlsURL: string;
    poster_url: string;
    isMediaAds: string;
    adsIntervalTime: number;
  };
}

export interface FavouriteVideoItem {
  id: number;
  media_id: string;
  title: string;
  description: string | null;
  type: 'VIDEO' | 'EVENT' | string;
  duration: string; // format: "HH:mm:ss"
  timestamp: string; // ISO date string
  thumbnail: string;
  slug: string;
  channelId: number;
  channelName: string;
  channelUrl: string;
}