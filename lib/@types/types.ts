import { PermissionType } from "./enums";

export interface User {
    pk?: string;
    id?: string;
    sk?: string;
    GSI1PK?: string;
    role_pk: string;
    shop_pks: string[];
    name?: string; // this cannot be changed by user
    nickname: string; // this can be changed by user
    type?: string;
    image?: string;
    password?: string; // currently we only enabled login with provider so this is null
    birthday?: string;
    ihsanPoint: number;
    email?: string;
    emailVerified: boolean;
}

export interface Role {
    pk?: string;
    permissions: PermissionType[];
    name: string;
    price?: number;
    image?: string;
}

export interface Permission {
    pk?: string;
    type: PermissionType;
}


export interface Reservation {
    pk?: string;
    shop_pk: string;
    lesson_pk: string;
    user_id: string;
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
   role_pk: string;
   notification_period: 'ONE_MONTH_BEFORE' | 'TWO_WEEKS_BEFORE' | 'ONE_WEEK_BEFORE';
}
export interface Course {
    pk?: string;
    name: string;
    description: string; // コースの全体的な
    lesson_setting: LessonSetting;
    member_notification_settings: MemberNotificationSetting[];
}

export interface Lesson {
    pk?: string;
    course_pk: string;
    description: string; //クラスの内容
    date: string;
    start_time: string;
    end_time: string;
    vip_seats_customers: {
        user_id: string;
        price: number;
    }[];
    custom_lesson_setting: LessonSetting;
}
export interface Shop {
    pk?: string;
    course_pks?: string[];
    membership_pks: string[]
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
    pk?: string;
    shop_pk: string;
    price: number;
    name: string;
    description: string;
}

