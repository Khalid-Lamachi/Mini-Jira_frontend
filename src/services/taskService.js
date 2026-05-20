

export const taskService = {
    createTask: async (title, sprintId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newTask = {
                    id: `MJ-${Math.floor(Math.random() * 900) + 100}`,
                    title: title,
                    tags: ['Feature'],
                    priority: 'medium',
                    status: 'todo',
                    sprintId: sprintId,
                    points: 0,
                    assignee: null
                };
                resolve(newTask);
            }, 500);
        });
    }
};