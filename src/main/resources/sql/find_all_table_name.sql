SELECT tablename as logical_table_name
FROM pg_tables
WHERE schemaname = :schema
  AND tablename NOT IN (SELECT child.relname
                        FROM pg_inherits
                                 JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
                                 JOIN pg_class child ON pg_inherits.inhrelid = child.oid
                        WHERE parent.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = :schema))
