import 'package:flutter/material.dart';
import 'package:planpals/features/comment/comment_service.dart';
import 'package:planpals/features/comment/models/comment_model.dart';
import 'package:planpals/features/profile/services/user_service.dart';

class CommentViewModel extends ChangeNotifier{
  final CommentService _commentService = CommentService();
  final UserService _userService = UserService();

  List<Comment> _comments = [];
  bool _isloading = false;
  String? _errorMessage;

  bool get isloading => _isloading;
  String? get errorMessage => _errorMessage;
  List<Comment> get comments => _comments;
  
  Future<void> fetchComments(String objectId, String type) async {
    _isloading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _comments = await _commentService.fetchComments(objectId, type);
      await _fetchCommentsUserName(); // Fetch usernames for each comment
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isloading = false;
      notifyListeners();
    }
  }

  Future<void> addComment(Comment comment, String objectId, String type) async {
    _isloading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      Comment newComment = await _commentService.addComment(comment);
      newComment.userName = await _userService.fetchUserById(newComment.createdBy).then((user) => user.preferredName);
      _comments.add(newComment);
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isloading = false;
      notifyListeners();
    }
  }



  /// Fetches and updates the username for each comment in the `_comments` list.
  ///
  /// This function iterates through each comment in the `_comments` list and
  /// fetches the username associated with the `createdBy` user ID using the
  /// `_userService`. The fetched username is then assigned to the `userName`
  /// property of the comment. In case of any error during the fetching process,
  /// an exception is thrown indicating the failure to fetch usernames.
  ///
  /// Throws:
  ///   - Exception: If an error occurs while fetching usernames.
  Future<void> _fetchCommentsUserName() async {
    try {
      for (var comment in _comments) {
        comment.userName = await _userService.fetchUserById(comment.createdBy).then((user) => user.preferredName);
      }
    } catch (e) {
      throw Exception('Failed to fetch usernames');
    }
  }
}