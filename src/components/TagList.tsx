import React from 'react';

interface TagListProps {
  tags: string[];
  editable?: boolean;
  onChange?: (tags: string[]) => void;
}

const TagList: React.FC<TagListProps> = ({ tags, editable = false, onChange }) => {
  const [input, setInput] = React.useState('');
  const [localTags, setLocalTags] = React.useState(tags);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const newTag = input.trim();
    if (newTag && !localTags.includes(newTag)) {
      const updated = [...localTags, newTag];
      setLocalTags(updated);
      setInput('');
      onChange && onChange(updated);
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = localTags.filter(t => t !== tag);
    setLocalTags(updated);
    onChange && onChange(updated);
  };

  React.useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  return (
    <div className="tag-list">
      {localTags.map(tag => (
        <span className="tag-item" key={tag}>
          {tag}
          {editable && (
            <button type="button" className="tag-remove" onClick={() => handleRemoveTag(tag)}>
              ×
            </button>
          )}
        </span>
      ))}
      {editable && (
        <form onSubmit={handleAddTag} className="tag-form-inline">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="태그 추가"
            maxLength={12}
          />
          <button type="submit">추가</button>
        </form>
      )}
    </div>
  );
};

export default TagList;
