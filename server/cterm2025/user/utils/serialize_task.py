# tasks/utils.py
def serialize_task(task):
    """
    Convert a Task instance into a dictionary including related task types.
    """
    data = {
        "id": task.id,
        "name": task.name,
        "description": task.description,
        "task_type": task.task_type,
        "is_mandatory": task.is_mandatory,
        "submission_format": task.submission_format,
        "max_score": task.max_score,
        "unlocks_next_topic": task.unlocks_next_topic,
        "first_deadline": task.first_deadline.isoformat() if task.first_deadline else None,
        "second_deadline": task.second_deadline.isoformat() if task.second_deadline else None,
        "third_deadline": task.third_deadline.isoformat() if task.third_deadline else None,
        "topic_id": task.topic.id if task.topic else None,
        "created_at": task.created_at.isoformat(),
        "updated_at": task.updated_at.isoformat(),
    }

    # Include related task types (e.g., quizzes)
    related_types = {}
    if hasattr(task, "quizzes"):
        related_types["quizzes"] = [
            {
                "id": quiz.id,
                "name": quiz.name,
                "description": quiz.description,
                "total_marks": quiz.total_marks,
                "created_at": quiz.created_at.isoformat(),
                "updated_at": quiz.updated_at.isoformat(),
            }
            for quiz in task.quizzes.all()
        ]

    # Add more task types here if you have them
    data["related_tasks"] = related_types
    return data
