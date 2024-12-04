import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/shopping_list/components/create_shopping_list_form.dart';
import 'package:planpals/features/shopping_list/components/shopping_list_card.dart';
import 'package:planpals/features/shopping_list/shopping_list_viewmodel.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
import 'package:provider/provider.dart';

class ShoppingListsView extends StatefulWidget {
  const ShoppingListsView({super.key});

  @override
  State<ShoppingListsView> createState() => _ShoppingListsViewState();
}

class _ShoppingListsViewState extends State<ShoppingListsView> {
  late ShoppingListViewModel _viewModel;
  late User user;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      user = Provider.of<UserViewModel>(context, listen: false).currentUser!;
      _viewModel = Provider.of<ShoppingListViewModel>(context, listen: false);
      await _viewModel.fetchShoppingListsByUserId(user.id);
    });
  }

  @override
  Widget build(BuildContext context) {
    
    return Scaffold(
      appBar: const NavigatorAppBar(title: "Shopping Lists"),
      body: _buildShoppingListList(context),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 30.0, right: 20.0),
        child: SizedBox(
          width: 70.0,
          height: 70.0,
          child: FloatingActionButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const CreateShoppingListForm()),
              );
            },
            tooltip: 'Add Shopping List',
            child: const Icon(Icons.add, size: 50.0),
          ),
        ),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }

  Widget _buildShoppingListList(BuildContext context) {
    ShoppingListViewModel viewModel = Provider.of<ShoppingListViewModel>(context);

    return viewModel.isLoading
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            child: GenericListView(
              itemList: viewModel.shoppingLists,
              itemBuilder: (shoppingList) => ShoppingListCard(
                shoppingList: shoppingList,
              ),
              onAdd: () {},
              headerTitle: "My Shopping Lists",
              headerIcon: Icons.shopping_bag,
              emptyMessage: "There are no shopping lists",
              functional: false,
              scrollable: true,
            )
        );
  }
}