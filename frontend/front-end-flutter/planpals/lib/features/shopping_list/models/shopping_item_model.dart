class ShoppingItem {
  final String name;
  final String location;
  final String addedBy;

  ShoppingItem({
    required this.name,
    required this.location,
    required this.addedBy,
  });

  // Factory method to create an ShoppingItem from JSON
  factory ShoppingItem.fromJson(Map<String, dynamic> json) {
    return ShoppingItem(
      name: json['name'] ?? '',
      location: json['location'] ?? '',
      addedBy: json['addedBy'] ?? '',
    );
  }

  // Method to convert an ShoppingItem to JSON
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'location': location,
      'addedBy': addedBy,
    };
  }

  @override
  String toString() {
    return 'ShoppingItem{name: $name, location: $location, addedBy: $addedBy}';
  }
}