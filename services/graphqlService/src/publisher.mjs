import { PubSub } from "graphql-subscriptions";

export default class Publisher {
    constructor() {
        throw new Error('Use Publisher.getInstance()');
    }

    static getInstance() {
        if (!Publisher.instance) {
            Publisher.instance = new PubSub();
        }
        return Publisher.instance;
    }
}