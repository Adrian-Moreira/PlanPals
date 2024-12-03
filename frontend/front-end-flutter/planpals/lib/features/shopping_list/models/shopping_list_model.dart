import 'package:planpals/features/shopping_list/models/shopping_item_model.dart';

class ShoppingList {
  final String id;
  final String name;
  final String? description; // Optional property
  final String createdBy;
  final List<ShoppingItem>? items; // Optional property
  final List<String>? rwUsers; // Optional property

  ShoppingList({
    required this.id,
    required this.name,
    this.description,
    required this.createdBy,
    this.items,
    this.rwUsers,
  });

  // Factory method to create a ShoppingList from JSON
  factory ShoppingList.fromJson(Map<String, dynamic> json) {
    return ShoppingList(
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      createdBy: json['createdBy'] ?? '',
      items: (json['items'] as List<dynamic>?)
          ?.map((item) => ShoppingItem.fromJson(item as Map<String, dynamic>))
          .toList(),
      rwUsers: List<String>.from(json['rwUsers'] ?? []),
    );
  }

  // Method to convert a ShoppingList to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'createdBy': createdBy,
      'items': items?.map((item) => item.toJson()).toList(),
      'rwUsers': rwUsers,
    };
  }

  @override
  String toString() {
    return 'ShoppingList{id: $id, name: $name, description: $description, createdBy: $createdBy, items: $items, rwUsers: $rwUsers}';
  }
}