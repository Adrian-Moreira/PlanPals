

import 'dart:convert';

import 'package:planpals/features/shopping_list/models/shopping_item_model.dart';
import 'package:planpals/features/shopping_list/models/shopping_list_model.dart';
import 'package:planpals/shared/network/api_service.dart';

class ShoppingListService {
  final ApiService _apiService = ApiService();

  Future<List<ShoppingList>> fetchAllShoppingLists() async {
    try {
      final response = await _apiService.get('/shoppingList');
      print("SHOPPINGLIST SERVICE: $response");
      final List<dynamic> jsonList = jsonDecode(response.body);
      return jsonList.map((json) => ShoppingList.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Failed to fetch shopping lists');
    }
  }

  Future<List<ShoppingList>> fetchShoppingListsByUserId(String userId) async {
    try {
      final response = await _apiService.get('/shoppingList?userId=$userId');
      print("SHOPPINGLIST SERVICE: $response");
      final List<dynamic> jsonList = jsonDecode(response.body)['data'];
      return jsonList.map((json) => ShoppingList.fromJson(json)).toList();
    } catch (e) {
      throw Exception('Failed to fetch shopping lists by user ID');
    }
  }

  Future<ShoppingList> addShoppingList(ShoppingList shoppingList) async {
    try {
      print("ADDING SHOPPING LIST SERVICE: $shoppingList");
      final response = await _apiService.post('/shoppingList', shoppingList.toJson());
      return ShoppingList.fromJson(jsonDecode(response.body)['data']);
    } catch (e) {
      throw Exception('Failed to add shopping list');
    }
  }

  Future<ShoppingList> addShoppingItemToShoppingList(String shoppingListId, ShoppingItem shoppingItem) async {
    try {
      print("ADDING SHOPPING ITEM SERVICE: ${shoppingItem.toJson()}");
      final response = await _apiService.post('/shoppingList/$shoppingListId/item', shoppingItem.toJson());
      return ShoppingList.fromJson(jsonDecode(response.body)['data']);
    } catch (e) {
      throw Exception('Failed to add shopping list item: $e');
    }
  }

  Future<ShoppingList> updateShoppingList(ShoppingList shoppingList) async {
    try {
      final response = await _apiService.patch('/shoppingList/${shoppingList.id}', shoppingList.toJson());
      print("UPDATING SHOPPING LIST SERVICE: ${response.body}");
      return ShoppingList.fromJson(jsonDecode(response.body)['data']);
    } catch (e) {
      throw Exception('Failed to update shopping list');
    }
  }
}