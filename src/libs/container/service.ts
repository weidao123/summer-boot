/**
 * service层的容器
 */
class ServiceContainer {
    private Container: any = {};

    public addService(name: string, service: any) {
        this.Container[name] = service;
    }

    public getService(name: string) {
        if(!this.Container[name]) {
            throw new Error("ERROR: service get failed," + name + "service is null");
        }
        return this.Container[name];
    }
}

export default new ServiceContainer();
