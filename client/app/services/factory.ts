
export interface IFactoryService {
    getCourseName(): string;
    getUserName(): string;
    getSocket(): any;
    getCourseList(): string[];
}

export class FactoryService implements IFactoryService {

    private courseName = '';
    private userName = '';
    private socket = undefined;
    private courseList: string[] = [];

    getCourseName() { return this.courseName; }
    getUserName() { return this.userName; }
    getSocket() { return this.socket; }
    getCourseList() { return this.courseList; }

}
