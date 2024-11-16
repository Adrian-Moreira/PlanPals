class Location {
  final String id;
  final DateTime createdAt; // Changed to DateTime
  final String createdBy;
  final DateTime updatedAt; // Changed to DateTime
  final List<String> comments; // List of Comment IDs
  final String name;
  final String? address; // Nullable address
  final String plannerId; // Reference to Planner ID

  Location({
    required this.id,
    required this.createdAt,
    required this.createdBy,
    required this.updatedAt,
    required this.comments,
    required this.name,
    this.address, // Nullable address
    required this.plannerId,
  });

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      id: json['_id'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String), // Convert String to DateTime
      createdBy: json['createdBy'] as String,
      updatedAt: DateTime.parse(json['updatedAt'] as String), // Convert String to DateTime
      comments: List<String>.from(json['comments'] as List), // Convert List<dynamic> to List<String>
      name: json['name'] as String,
      address: json['address'] as String?, // Nullable
      plannerId: json['plannerId'] as String, // Reference to Planner ID
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'createdAt': createdAt.toIso8601String(), // Convert DateTime to String
      'createdBy': createdBy,
      'updatedAt': updatedAt.toIso8601String(), // Convert DateTime to String
      'comments': comments,
      'name': name,
      'address': address, // Nullable
      'plannerId': plannerId,
    };
  }
}
