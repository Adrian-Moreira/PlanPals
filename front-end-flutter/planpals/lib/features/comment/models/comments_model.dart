import 'package:planpals/features/comment/models/comment_model.dart';

class Comments {
  final String objectId;
  final String type;
  late List<Comment> commentList;

  Comments({required this.objectId, required this.type});
}