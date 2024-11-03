import 'package:flutter/material.dart';
import 'package:planpals/features/comment/comment_viewmodel.dart';
import 'package:planpals/features/comment/models/comment_model.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:provider/provider.dart';

class CommentPageView extends StatefulWidget {
  final Widget item;
  final String objectId;
  final String type;

  const CommentPageView(
      {super.key,
      required this.objectId,
      required this.type,
      required this.item});

  @override
  State<CommentPageView> createState() => _CommentPageViewState();
}

class _CommentPageViewState extends State<CommentPageView> {
  final CommentViewModel _commentViewModel = CommentViewModel();
  List<Comment> _comments = [];

  late User _user;

  final TextEditingController _commentController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  bool _showSendButton = false;

  @override
  void initState() {
    super.initState();

    _user = Provider.of<UserViewModel>(context, listen: false).currentUser!;

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      await _commentViewModel.fetchComments(widget.objectId, widget.type);

      setState(() {
        _comments = _commentViewModel.comments;
      });
    });

    // Add listener to toggle send button visibility
    _focusNode.addListener(() {
      setState(() {
        _showSendButton = _focusNode.hasFocus;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return _commentViewModel.isloading
        ? const Center(child: CircularProgressIndicator())
        : Scaffold(
            appBar: AppBar(
              title: const Text('Comment Page'),
            ),
            body: Column(
              children: [
                Expanded(
                  child: _buildCommentList(),
                ),
                _buildSendButton(),
              ],
            ),
          );
  }

  Widget _buildComment(Comment comment) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10.0),
      decoration: BoxDecoration(
        color: comment.isCreatedBy(_user.id) ? Colors.blue[200] : Colors.grey[200],
        borderRadius: BorderRadius.circular(8.0),
        border: Border.all(
          color: Colors.blueAccent, 
          width: 2.0, 
        ),
      ),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8.0), 
        ),
        child: Padding(
          padding: const EdgeInsets.only(left: 13.0, right: 13.0, top: 8.0, bottom: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                comment.userName,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  color: Colors.blueAccent,
                ),
              ),
              const SizedBox(height: 5),
              Text(comment.content),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCommentList() {
    return 
    ListView.builder(
      padding: const EdgeInsets.only(left: 5.0, right: 5.0),
      itemCount: _comments.length + 1,
      itemBuilder: (context, index) {
        if (index == 0) {
          return widget.item;
        }

        Comment comment = _comments[index-1];
        return _buildComment(comment);
      },
    );
  }

  Widget _buildSendButton() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: Colors.grey[200],
      child: Row(
        children: [
          // Text input field
          Expanded(
            child: TextField(
              controller: _commentController,
              focusNode: _focusNode,
              decoration: InputDecoration(
                hintText: 'Add a comment...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
          ),

          // Conditionally displayed Send button
          if (_showSendButton)
            IconButton(
              icon: const Icon(
                Icons.send,
                size: 35,
              ),
              color: Colors.blueAccent,
              tooltip: 'Send',
              onPressed: _handleSendComment,
            )
        ],
      ),
    );
  }

  void _handleSendComment() async {
    String comment = _commentController.text.trim();
    if (comment.isNotEmpty) {
      Comment newComment = Comment(
        createdBy: _user.id,
        content: comment,
        objectId: widget.objectId,
        type: widget.type,
      );

      await _commentViewModel.addComment(
          newComment, widget.objectId, widget.type);

      setState(() {
        _commentController.clear();
      });
    }
  }

  @override
  void dispose() {
    _commentController.dispose();
    _focusNode.dispose();
    _commentViewModel.dispose();
    super.dispose();
  }
}
