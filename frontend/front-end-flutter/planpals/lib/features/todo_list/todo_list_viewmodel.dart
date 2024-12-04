import 'package:flutter/material.dart';
import 'package:planpals/features/todo_list/models/todo_list_model.dart';
import 'package:planpals/features/todo_list/models/todo_task_model.dart';
import 'package:planpals/features/todo_list/todo_list_service.dart';

class TodoListViewModel extends ChangeNotifier {
  final TodoListService _todoListService = TodoListService();

  List<TodoList> _todoLists = [];
  List<TodoTask> _todoTasks = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<TodoList> get todoLists => _todoLists;
  List<TodoTask> get todoTasks => _todoTasks;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  TodoList? currentTodoList;

  Future<void> fetchTodoListsByUserId(String userId) async {
    _isLoading = true;
    _todoLists = [];
    notifyListeners();

    try {
      _todoLists = await _todoListService.fetchTodoListsByUserId(userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchTodoTasksByTodoListId(
      String todoListId, String userId) async {
    _isLoading = true;
    _todoTasks = [];
    notifyListeners();

    try {
      _todoTasks =
          await _todoListService.fetchTodoTasksByTodoListId(todoListId, userId);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<TodoList> addTodoList(TodoList todoList) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    TodoList newTodoList = todoList;

    try {
      newTodoList = await _todoListService.addTodoList(todoList);
      _todoLists.add(newTodoList);
      _errorMessage = null;
      currentTodoList = newTodoList;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return newTodoList;
  }

  Future<TodoTask> addTodoTask(TodoTask todoTask) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    TodoTask newTodoTask = todoTask;
    try {
      newTodoTask = await _todoListService.addTodoTask(todoTask);
      _todoTasks.add(newTodoTask);
      _errorMessage = null;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    return newTodoTask;
  }

  Future<TodoTask> updateTodoTask(TodoTask todoTask, String userId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    TodoTask updatedTodoTask = todoTask;
    try {
      updatedTodoTask = await _todoListService.updateTodoTask(todoTask, userId);
      _todoTasks
          .firstWhere((task) => task.id == updatedTodoTask.id)
          .update(updatedTodoTask);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }

    return updatedTodoTask;
  }

  Future<void> deleteTodoTask(TodoTask todoTask, String userId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    
    try {
      await _todoListService.deleteTodoTask(todoTask, userId);
      _todoTasks.removeWhere((task) => task.id == todoTask.id);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> inviteUserToTodoList(String todoListId, String userId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();
    
    try {
      TodoList updated = await _todoListService.inviteUserToTodoList(todoListId, userId);

      _todoLists
          .firstWhere((todoList) => todoList.id == todoListId)
          .update(updated);

      currentTodoList = updated;
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
