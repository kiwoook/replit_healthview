import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface CommunityPostProps {
  post: {
    id: number;
    title?: string;
    content: string;
    type: string;
    imageUrl?: string;
    likes: number;
    createdAt: string;
    commentCount: number;
    user: {
      id: string;
      firstName: string;
      profileImageUrl?: string;
    };
  };
  onLike?: () => void;
  onComment?: () => void;
}

export default function CommunityPost({ post, onLike, onComment }: CommunityPostProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "question": return { label: "질문", color: "bg-blue-100 text-blue-800" };
      case "achievement": return { label: "성과", color: "bg-green-100 text-green-800" };
      case "general": return { label: "일반", color: "bg-gray-100 text-gray-800" };
      default: return { label: "일반", color: "bg-gray-100 text-gray-800" };
    }
  };

  const typeInfo = getTypeLabel(post.type);
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { 
    addSuffix: true, 
    locale: ko 
  });

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.profileImageUrl} />
              <AvatarFallback className="bg-primary text-white">
                {post.user.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">
                  {post.user.firstName}
                </span>
                <Badge className={typeInfo.color}>
                  {typeInfo.label}
                </Badge>
              </div>
              <span className="text-sm text-gray-500">{timeAgo}</span>
            </div>
          </div>
          
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-4">
          {post.title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {post.title}
            </h3>
          )}
          
          <p className="text-gray-700 whitespace-pre-wrap">
            {post.content}
          </p>

          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt="게시물 이미지"
              className="mt-3 w-full rounded-lg object-cover max-h-96"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
            >
              <Heart className="h-4 w-4" />
              <span>{post.likes}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onComment}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-500"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{post.commentCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-500"
            >
              <Share2 className="h-4 w-4" />
              <span>공유</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
