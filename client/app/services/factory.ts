
export interface IFactoryService {
    getCourseName(): string;
    getUserName(): string;
    getSocket(): any;
    getCourseList(): string[];
    setCourseName(course: string): void;
    setUserName(username: string): void;
    setSocket(socket: any): void;
    setCourseList(courseList: string[]): void;
}

export class FactoryService implements IFactoryService {

    private courseName = '';
    private username = '';
    private socket = undefined;
    private courseList: string[] = [];

    getCourseName() { return this.courseName; }
    getUserName() { return this.username; }
    getSocket() { return this.socket; }
    getCourseList() { return this.courseList; }

    setCourseName(course: string): void { this.courseName = course; }
    setUserName(username: string): void { this.username = username; }
    setSocket(socket: any): void { this.socket = socket; }
    setCourseList(courseList: string[]): void { this.courseList = courseList; }

}
