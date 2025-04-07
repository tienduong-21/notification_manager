class Notification {
    constructor({ title, content, startTime, endTime, userType }) {
        this.id = Date.now().toString();
        this.title = title;
        this.content = content;
        this.startTime = startTime;
        this.endTime = endTime;
        this.userType = userType;
        this.status = 'PENDING'; // PENDING, SENT, FAILED
        this.createdAt = new Date().toISOString();
    }

    validate() {
        if (!this.title || !this.content || !this.startTime || !this.endTime || !this.userType) {
            throw new Error('Missing required fields');
        }
        
        const start = new Date(this.startTime);
        const end = new Date(this.endTime);
        if (start >= end) {
            throw new Error('Start time must be before end time');
        }
        
        return true;
    }
}

module.exports = Notification; 