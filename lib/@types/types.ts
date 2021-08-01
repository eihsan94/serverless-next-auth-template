import { PermissionType } from "./enums";

export interface User {
    partition_key?: string;
    role_partition_key: string;
    shop_partition_keys: string[];
    email: string;
    password: string;
    fullname: string;
    image?: string;
    birthday?: string;
    ihsanPoint: number;
}

export interface Role {
    partition_key?: string;
    permissions: PermissionType[];
    name: string;
    price?: number;
    image?: string;
}

export interface Permission {
    partition_key?: string;
    type: PermissionType;
}


export interface Reservation {
    partition_key?: string;
    shop_partition_key: string;
    lesson_partition_key: string;
    user_partition_key: string;
    purchase_date: string;
    reservation_no: string; // reservation_no
    isWaiting: {
        priority: number;
    }
}

export interface LessonSetting {
    online: {
        link: string;
        ihsanPostToken: string;
    };
    offline: {
        address: string;
        notes: string;
    }
    seat_limits: number;
}
export interface MemberNotificationSetting {
   role_partition_key: string;
   notification_period: 'ONE_MONTH_BEFORE' | 'TWO_WEEKS_BEFORE' | 'ONE_WEEK_BEFORE';
}
export interface Course {
    partition_key?: string;
    name: string;
    description: string; // コースの全体的な
    lesson_setting: LessonSetting;
    member_notification_settings: MemberNotificationSetting[];
}

export interface Lesson {
    partition_key?: string;
    course_partition_key: string;
    description: string; //クラスの内容
    date: string;
    start_time: string;
    end_time: string;
    vip_seats_customers: {
        user_partition_key: string;
        price: number;
    }[];
    custom_lesson_setting: LessonSetting;
}
export interface Shop {
    partition_key?: string;
    course_partition_keys?: string[];
    membership_partition_keys: string[]
    name: string;
    image?: string;
    analytics: {
        weeklySale: number;
        topSubscriber: User[];
        customerBirthdays: {user:User}[];
        topGrossingCourses: {course: Course; sales: number}[];
    };
}
export interface Membership {
    partition_key?: string;
    shop_partition_key: string;
    price: number;
    name: string;
    description: string;
}

