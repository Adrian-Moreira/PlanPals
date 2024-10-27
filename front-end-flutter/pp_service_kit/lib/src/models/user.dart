import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User extends Object {
  @JsonKey(name: '_id')
  final String id;
  final String userName;
  final String preferredName;

  User({
    required this.id,
    required this.userName,
    required this.preferredName,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  Map<String, dynamic> toJson() => _$UserToJson(this);

  @override
  String toString() {
    return 'User{id: $id, userName: $userName, preferredName: $preferredName}';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is User &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          userName == other.userName;

  @override
  int get hashCode => id.hashCode ^ userName.hashCode;
}
