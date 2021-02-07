import { ServiceLocator } from "../ServiceLocator";

export class MapService {
    private serviceLocator: ServiceLocator;

    public init(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }
}
