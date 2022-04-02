import BaseLogic from "./baseLogic.mjs";

export default class Role extends BaseLogic {
    constructor(...args) {
        super(...args)
    }

    async getUserRoles(args) {
        return this.db.getUserRoles(args.userId)
            .then(data => {
                if (!data || !data.length) return []

                return data.map(userRole => {
                    return userRole?.battlemanager_roles;
                });
            });
    }
}