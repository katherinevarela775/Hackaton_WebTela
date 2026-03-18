def serialize_product(p):
    """Serializa un modelo Product a dict JSON-serializable.
    Usado por products, vendor y admin para devolver datos consistentes.
    """
    return {
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'category': p.category,
        'base_price': p.base_price,
        'sale_type': p.sale_type,
        'stock': p.stock,
        'images': p.images or [],
        'ranking': p.ranking or 3.0,
        'tags': p.tags or [],
        'volume_prices': p.volume_prices or {},
        'vendor_id': p.vendor_id,
        'sales_count': p.sales_count or 0,
    }
