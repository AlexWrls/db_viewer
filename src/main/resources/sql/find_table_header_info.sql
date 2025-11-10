SELECT column_name, is_nullable , data_type, character_maximum_length
FROM information_schema.columns
WHERE table_schema = :schema AND table_name = :table
ORDER BY ordinal_position