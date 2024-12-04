class TodoList {
  String id;
  String createdBy;
  String name;
  String? description;
  List<String> tasks;
  List<String> roUsers;
  List<String> rwUsers;

  TodoList({
    required this.id,
    required this.createdBy,
    required this.name,
    this.description,
    this.tasks = const [],
    this.roUsers = const [],
    this.rwUsers = const [],
  });

  // Convert a TodoList object to a Map (for saving to a database or converting to JSON)
  Map<String, dynamic> toMap() {
    return {
      'createdBy': createdBy,
      'name': name,
      'description': description,
      'tasks': tasks,
      'roUsers': roUsers,
      'rwUsers': rwUsers,
    };
  }

  // Convert a Map to a TodoList object (for parsing from JSON or a database result)
  factory TodoList.fromJson(Map<String, dynamic> map) {
    return TodoList(
      id: map['_id'] ?? '',
      createdBy: map['createdBy'] ?? '',
      name: map['name'] ?? '',
      description: map['description'] ?? '',
      tasks: List<String>.from(map['tasks']) ?? [],
      roUsers: List<String>.from(map['roUsers']) ?? [],
      rwUsers: List<String>.from(map['rwUsers']) ?? [],
    );
  }

  // Convert the TodoList object to a JSON map (for API or database storage)
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'createdBy': createdBy,
      'name': name,
      'description': description,
      'tasks': tasks,
      'roUsers': roUsers,
      'rwUsers': rwUsers,
    };
  }
}
