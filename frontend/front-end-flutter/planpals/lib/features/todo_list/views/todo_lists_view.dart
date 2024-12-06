import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/todo_list/todo_list_viewmodel.dart';
import 'package:planpals/features/todo_list/views/components/create_todo_list_form.dart';
import 'package:planpals/features/todo_list/views/components/todo_list_card.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/navigator_bar.dart';
import 'package:planpals/shared/styles/background.dart';
import 'package:provider/provider.dart';

class TodoListsView extends StatefulWidget {
  const TodoListsView({super.key});

  @override
  State<TodoListsView> createState() => _TodoListsViewState();
}

class _TodoListsViewState extends State<TodoListsView> {
  late TodoListViewModel _todoListViewModel;
  late User user;

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      user = Provider.of<UserViewModel>(context, listen: false)
          .currentUser!; // get user from provider
      _todoListViewModel = Provider.of<TodoListViewModel>(context,
          listen: false); // get todo list view model from provider
      await _todoListViewModel.fetchTodoListsByUserId(user.id); // fetch todo lists by user id
    });
  }

  @override
  Widget build(BuildContext context) {
    return Background(
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: const NavigatorAppBar(title: "Travel Planners"),
        body: _buildTodoListList(context),
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
                      builder: (context) => const CreateTodoListForm()),
                );
              },
              tooltip: 'Add Todo List',
              child: const Icon(Icons.add, size: 50.0),
            ),
          ),
        ),
        floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      ),
    );
  }

  Widget _buildTodoListList(BuildContext context) {
    TodoListViewModel viewModel = Provider.of<TodoListViewModel>(context);

    return viewModel.isLoading
        ? const Center(child: CircularProgressIndicator())
        : SingleChildScrollView(
            child: GenericListView(
              itemList: viewModel.todoLists,
              itemBuilder: (todoList) => TodoListCard(
                todoList: todoList,
              ),
              onAdd: () {},
              headerTitle: "My Todo Lists",
              headerIcon: Icons.list,
              emptyMessage: "There are no todo lists",
              functional: false,
              scrollable: true,
              headerColor: Colors.white,
            ),
          );

  }
}
