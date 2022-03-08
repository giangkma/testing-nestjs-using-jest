export const dataAccessPolicies = {
    avatars: {
        organization: 'rwd',
        creator: 'rwd',
        consumer: 'r',
    },
    pm: {
        organization: 'rw',
        creator: 'r',
        consumer: 'r',
        'next-of-kin': 'rw',
    },
    cm: {
        organization: 'r',
        creator: 'r',
        consumer: 'r',
    },
};
