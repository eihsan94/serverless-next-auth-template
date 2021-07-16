export interface User {
    partition_key?: string;
    role_partition_key: string;
    shop_partition_keys: string[];
    email: string;
    password: string;
    name: string;
    image?: string;
    birthday?: string;
    isanPoint: number;
}

export interface Role {
    partition_key?: string;
    name: string;
    permission_partition_keys: string[];
    price?: number;
    image?: string;
}

export interface Permission {
    partition_key?: string;
    type: PermissionType;
}


export interface Order {
    partition_key?: string;
    course_partition_key: string;
    paymentDate: string;
}

export interface Course {
    partition_key?: string;
    name: string;
    description: string;
    limits: number;
    zoomUrl: string;
}

export interface Shop {
    partition_key?: string;
    name: string;
    course_partition_keys?: string[];
    image?: string;
    orders: Order;
    analytics: {
        weeklySale: number;
        topSubscriber: User[];
        customerBirthdays: {user:User}[];
        topGrossingCourses: {course: Course; sales: number}[];
    };
}

export enum PermissionType {
    CAN_EDIT_SHOP="CAN_EDIT_SHOP",
    CAN_EDIT_USER="CAN_EDIT_USER",
    CAN_EDIT_ROLE="CAN_EDIT_ROLE",
    CAN_EDIT_COURSE="CAN_EDIT_COURSE",
    CAN_EDIT_PERMISSION="CAN_EDIT_PERMISSION",
    CAN_SEE_ANALYTICS="CAN_SEE_ANALYTICS",
    CAN_HAVE_MULTIPLE_SHOP="CAN_HAVE_MULTIPLE_SHOP",
    CAN_HAVE_1_COURSE_MAX="CAN_HAVE_1_COURSE_MAX",
    CAN_HAVE_10_COURSE_MAX="CAN_HAVE_10_COURSE_MAX",
    CAN_HAVE_100_COURSE_MAX="CAN_HAVE_100_COURSE_MAX",
    CAN_HAVE_UNLIMITED_COURSE_MAX="CAN_HAVE_UNLIMITED_COURSE_MAX",
    CAN_HAVE_5_USER_MAX="CAN_HAVE_5_USER_MAX",
    CAN_HAVE_50_USER_MAX="CAN_HAVE_10_USER_MAX",
    CAN_HAVE_500_USER_MAX="CAN_HAVE_500_USER_MAX",
    CAN_HAVE_UNLIMITED_USER_MAX="CAN_HAVE_UNLIMITED_USER_MAX",
}