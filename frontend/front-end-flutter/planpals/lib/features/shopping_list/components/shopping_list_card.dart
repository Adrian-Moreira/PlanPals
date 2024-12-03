import 'package:flutter/material.dart';
import 'package:planpals/features/shopping_list/models/shopping_list_model.dart';
import 'package:planpals/features/shopping_list/shopping_list_viewmodel.dart';
import 'package:planpals/features/shopping_list/views/shopping_list_details_view.dart';
import 'package:provider/provider.dart';

class ShoppingListCard extends StatelessWidget {
  final ShoppingList shoppingList;

  const ShoppingListCard({super.key, required this.shoppingList});

  @override
  Widget build(BuildContext context) {
    return Card(
        child: ListTile(
      title: Text(shoppingList.name),
      onTap: () {
        Provider.of<ShoppingListViewModel>(context, listen: false)
            .currentShoppingList = shoppingList;

        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ShoppingListDetailsView(
              shoppingList: shoppingList,
            ),
          ),
        );
      },
    ));
  }
}
