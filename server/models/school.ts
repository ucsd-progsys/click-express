
import { Course    } from '../models/schemas';
import { ClassRoom } from '../models/classroom';

export class School {

    private classRooms: Map<ClassRoom> = {};
    
    /**
     *  StudentID -> ClassRoom
     *  
     *  Assumption: a student can be in one class at most at a single time
     * 
     */ 
    private activeStudents: Map<ClassRoom> = {};

    public populate() {
        Course.find({ }, (err: any, courses: ICourse[]) => {
            if (err) {
                console.log('ERROR: Could not read class information.');
            }            
            courses.forEach(course => {
                this.classRooms[course._id] = new ClassRoom(course._id, course.description);
            });            
        });
    }
    
    public studentJoinsClass(studentId: string, courseId: string) {
        let classRoom = this.classRooms[courseId]
        
        if (!classRoom) {
            console.log('Course', courseId, 'does not exist.');
        }
        
        // TODO: Check enrollment
        
        classRoom.studentEnters(studentId);
        
        this.activeStudents
                
        
    }
    
    public studentLeaves(studentId: string) {
        
    }
    
}