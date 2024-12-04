import 'package:flutter/material.dart';
import 'package:planpals/features/shopping_list/Shopping_list_service.dart';
import 'package:planpals/features/shopping_list/models/shopping_item_model.dart';
import 'package:planpals/features/shopping_list/models/shopping_list_model.dart';

class ShoppingListViewModel extends ChangeNotifier {
  final ShoppingListService _shoppingListService = ShoppingListService();

  List<ShoppingList> _shoppingLists = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<ShoppingList> get shoppingLists => _shoppingLists;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  ShoppingList? currentShoppingList;

  Future<void> fetchAllShoppingLists() async {
    _isLoading = true;
    notifyListeners();
    try {
      _shoppingLists = await _shoppingListService.fetchAllShoppingLists();
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchShoppingListsByUserId(String userId) async {
    _isLoading = true;
    notifyListeners();
    try {
      _shoppingLists =
          await _shoppingListService.fetchShoppingListsByUserId(userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<ShoppingList> addShoppingList(ShoppingList shoppingList) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    ShoppingList newShoppingList = shoppingList;
    try {
      newShoppingList =
          await _shoppingListService.addShoppingList(shoppingList);
      _shoppingLists.add(newShoppingList);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    return newShoppingList;
  }

  Future<void> addShoppingItemToShoppingList(
      String shoppingListId, ShoppingItem shoppingItem) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      ShoppingList newShoppingList = await _shoppingListService
          .addShoppingItemToShoppingList(shoppingListId, shoppingItem);

      _shoppingLists
          .firstWhere((element) => element.id == newShoppingList.id)
          .items
          ?.add(shoppingItem);

      currentShoppingList = newShoppingList;

      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> updateShoppingList(ShoppingList shoppingList) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    ShoppingList updatedShoppingList = shoppingList;
    try {
      updatedShoppingList =
          await _shoppingListService.updateShoppingList(shoppingList);

      final index = _shoppingLists
          .indexWhere((element) => element.id == updatedShoppingList.id);
      if (index != -1) {
        _shoppingLists[index] = updatedShoppingList;
      }

      currentShoppingList = updatedShoppingList;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteShoppingItemFromShoppingList(
      ShoppingList shoppingList, ShoppingItem shoppingItem) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      shoppingList.items?.remove(shoppingItem);
      print("SHOULD BESHOPPING LIST UPDATED SERVICE: ${shoppingList.toJson()}");
      print("DELETING SHOPPING ITEM SERVICE: ${shoppingItem.toJson()}");
      currentShoppingList =
          await _shoppingListService.updateShoppingList(shoppingList);
      print("UPDATED SHOPPING LIST SERVICE: ${currentShoppingList!.toJson()}");
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> inviteUserToShoppingList(
      String shoppingListId, String userId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      ShoppingList updated = await _shoppingListService
          .inviteUserToShoppingList(shoppingListId, userId);

      _shoppingLists
          .firstWhere((element) => element.id == shoppingListId)
          .update(updated);

      currentShoppingList = updated;
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
